import { writable } from 'svelte/store';
import { continuePostLogin } from './continue-post-login';
import { signData } from './sign-data';
import { Base64 } from 'js-base64';

export interface Auth0Session {
	sessionToken?: string;
	state?: string;
	continueToken?: string;
	action?: string;
}

const getIssuer = (sessionToken) => {
	const payload = sessionToken.split('.')[1];
	const decodedPayload = Base64.decode(payload);
	const { iss } = JSON.parse(decodedPayload);
	return iss;
};

function createSessionStore() {
	const { subscribe, set, update } = writable({} as Auth0Session);
	return {
		subscribe,
		reset: () => {},
		init: (data: Auth0Session) => set(data),
		dispatch: async (data: unknown) => {
			let sess: Auth0Session;
			subscribe(($) => (sess = $))();
			const continueToken = await signData(data, sess);
			const action = `https://${getIssuer(sess.sessionToken)}/continue?state=${sess.state}`;
			update((sess) => {
				return { ...sess, continueToken, action } as Auth0Session;
				// await continuePostLogin(continueToken, sess)
			});
		}
	};
}

export const auth0Session = createSessionStore();
