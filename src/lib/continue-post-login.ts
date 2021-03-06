import { Base64 } from 'js-base64';
import type { Auth0Session } from './session.store';

const base_path = 'process.env.BASE_PATH';

export const continuePostLogin = async (
	token: string,
	sessionData: Auth0Session
): Promise<{ state: string; continueToken: string }> => {
	const issuer = getIssuer(sessionData.sessionToken);
	try {
		var details = {
			continueToken: token
		};

		var formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + '=' + encodedValue);
		}

		const rawResponse = await fetch(`https://${issuer}/continue?state=${sessionData.state}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: formBody.join('&')
		});
		const response = await rawResponse.json();
		return response.token;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const getIssuer = (sessionToken) => {
	const payload = sessionToken.split('.')[1];
	const decodedPayload = Base64.decode(payload);
	const { iss } = JSON.parse(decodedPayload);
	return iss;
};
