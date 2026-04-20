function validateName(name) {
    if (!name || name.trim() === '') {
        return {
            valid: false,
            error: 'Missing or empty name'
        }
    }

    if (typeof name !== 'string') {
        return {
            valid: false, 
            errror: "Invalid type: name must be a string"
        };
    }

    if (name.length > 100) {
        return {
            valid: false, 
            error: 'Name too long: maximum 100 characters'
        }
    }

    return {
        valid: true,
        name: name.trim().toLowerCase() 
    };
}

function validateId(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
}

function validateFilters(gender, countryId, ageGroup) {
    const validGenders = ['male', 'female'];
    const validAgeGroups = ['child', 'teenager', 'adult', 'senior'];

    if (gender && !validGenders.includes(gender.toLowerCase())) {
        return {
            valid: false, 
            error: 'Invalid gender filter'
        }
    }

    if (ageGroup && !validAgeGroups.includes(ageGroup.toLowerCase())) {
        return {
            valid: false, 
            error: 'Invalid age_group filter'
        };
    }

    return {
        valid: true
    };
};