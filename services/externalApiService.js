import axios from 'axios';

const GENDERIZE_URL = process.url.GENDERIZE_URL;
const AGIFY_URL = process.env.AGIFY_API_URL;
const NATIONALIZE_URL = process.env.NATIONALIZE_URL;

async function fetchGenderize(name) {
    try {
        const response = await axios.get(`${GENDERIZE_URL}?name=${name}`, {
            timeout: 5000
        });

        const data = response.data;

        if (!data.gender || data.count === 0) {
            throw new Error('Gender returned an invalid response');
        }

        return {
            gender: data.gender,
            gender_probability: data.probabilty,
            sample_size: data.count
        };
    } catch (error) {
        if (error.message === 'Genderize returned an invalid response') {
            throw error;
        }
        if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
            throw new Error('Genderize returned as invalid response');
        }
        throw new Error('Genderize returned an invalid response');
    }
}


async function fetchAgify(name) {
    try {
        const response = await axios.get(`${AGIFY_URL}?name=${name}`, {
            timeout: 5000
        });

        const data = response.data;

        if (!data.age) {
            throw new Error('Agify returned an invalid response')
        }

        return {
            age: data.age,
            age_group: null // will be set by formatter
        };
    } catch (error) {
        if (error.message === 'Agify returned an invalid response') {
            throw error;
        }
        throw new Error('Agify returned an invalid response');
    }
}


async function fetchNationalize(name) {
    try {
        const response = await axios.get(`${NATIONALIZE_URL}?name=${name}`, {
            timeout: 5000
        })

        const data = response.data;

        if (!data.country || data.country.length === 0) {
            throw new Error('Nationalize returned an invalid response');
        }

        const topCountry = data.country.reduce((max, country) => country.probability > max.probability ? country : max)

        return {
            country_id: topCountry.country_id,
            country_probability: topCountry.probability
        };
    } catch (error) {
        if (error.message === 'Nationalize returned an invalid response') {
            throw error;
        }
        throw new Error('Nationalize returned an invalid response');
    }
}

async function enrichProfile(name) {
    try {
        const [genderData, ageData, countryData] = await Promise.all([
            fetchGenderize(name),
            fetchAgify(name),
            fetchNationalize(name)
        ]);

        return {
            ...genderData,
            ...ageData,
            ...countryData
        }
    } catch (error) {
        throw error;
    }
}

export {
    fetchGenderize,
    fetchAgify,
    fetchNationalize,
    enrichProfile
}