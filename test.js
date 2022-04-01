const profile = {
    "customProfile": {
      "favoriteHoliday": "beach",
      "firstName": "John",
      "lastName": "Doe",
      "age": 27,
      "residentialAddress": {
          "postalCode": 55445
      }
    }
  };
const schema = {
    "title": "My Attributes",
    "subheading": "We need additional information before you start using our service.",
    "theme": {
        "logoUrl": "https://cdn.auth0.com/website/bob/press/shield-dark.png",
        "accentColor": "#635dff",
        "backgroundColor": "#ffffff",
        "textColor": "#000000"
    },
    "properties": {
        "firstName": {
            "label": "First Name",
            "type": "text",
            "required": true
        },
        "lastName": {
            "label": "Last Name",
            "type": "text"
        },
        "age": {
            "label": "Age",
            "type": "number"
        },
        "favoriteHoliday": {
            "label": "Favorite Holiday",
            "type": "select",
            "options": [
                {
                    "label": "Beach holiday",
                    "value": "beach"
                },
                {
                    "label": "Holiday Resort",
                    "value": "resort"
                },
                {
                    "label": "Wild Animal Safari",
                    "value": "safari"
                }
            ]
        },
        "residentialAddress": {
            "type": "object",
            "label": "Residential Address",
            "properties": {
                "street": {
                    "label": "Street",
                    "type": "text"
                },
                "postalCode": {
                    "label": "Postal Code",
                    "type": "number"
                },
                "city": {
                    "label": "City",
                    "type": "text"
                },
            }
        }
    }
};



const getSchemaToRequest = (schema, user_metadata, multipage = true, max_attributes_per_page = 10) => {
    const workingCopy = JSON.parse(JSON.stringify(schema));

    const getTopLevelAttributesFromProfile = (profile) => Object.keys(profile).filter(itemKey => typeof profile[itemKey] !== 'object')
    const getTopLevelAttributesFromSchema = (raw_schema) => Object.entries(raw_schema.properties).filter(([_, value]) => !value.properties).map(([key, _]) => key)
    const getNestedAttributesFromSchema = (raw_schema) => Object.entries(raw_schema.properties).filter(([_, value]) => value.properties).map(([key, _]) => key)
    const determineUnnecessaryAttributes = (presentAttributes, requiredAttributes) => presentAttributes.filter(attr => requiredAttributes.includes(attr))

    const limitFieldsInSchema = (schema, numberOfItems) => {
        const topLevel = getTopLevelAttributesFromSchema(schema)

        const itemsToRemove = topLevel.slice(numberOfItems, topLevel.length);
        for(const item of itemsToRemove) {
            delete schema.properties[item]
        }

        const nested = getNestedAttributesFromSchema(schema)
        for(const item of nested) {
            schema.properties[item] = limitFieldsInSchema(schema.properties[item], numberOfItems)
        }
        return schema
    } 


    // handle top level attributes
    const alreadyPresentTopLevelAttributes = getTopLevelAttributesFromProfile(user_metadata.customProfile)
    const requiredTopLevelAttributes = getTopLevelAttributesFromSchema(workingCopy)
    const topLevelAttributesToRemove = determineUnnecessaryAttributes(alreadyPresentTopLevelAttributes, requiredTopLevelAttributes)
    for(const attr of topLevelAttributesToRemove) {
        delete workingCopy.properties[attr]
    }

    // handle nested attributes
    const requiredNestedAttributes = getNestedAttributesFromSchema(workingCopy)
    for(const attr of requiredNestedAttributes) {
        const present = getTopLevelAttributesFromProfile(user_metadata.customProfile[attr]);
        const required = getTopLevelAttributesFromSchema(workingCopy.properties[attr]);
        const unnecessaryAttribues = determineUnnecessaryAttributes(present, required)
        for(const toRemove of unnecessaryAttribues) {
            delete delete workingCopy.properties[attr].properties[toRemove]
        }
    }

    const limitedSchema = limitFieldsInSchema(workingCopy, max_attributes_per_page)
    // limit pages
    if(!multipage) {
        if (getTopLevelAttributesFromSchema(limitedSchema).length) {
            for(const nestedProperty of getNestedAttributesFromSchema(limitedSchema)) {
                delete limitedSchema.properties[nestedProperty];
            }
        } else {
            // only allow one page out of any nested pages if multipage is false
            const nestedAttributes = getNestedAttributesFromSchema(limitedSchema)
            const nestedPropertiesToRemove = nestedAttributes.slice(1, nestedAttributes.length);
            for(const nestedProperty of nestedPropertiesToRemove) {
                delete limitedSchema.properties[nestedProperty];
            }
        }
        
    }
    
    return limitedSchema
}



const main = () => {

    console.log("\n\n\n", JSON.stringify(getSchemaToRequest(schema, profile, false, 1), null, 2))
}

main();
