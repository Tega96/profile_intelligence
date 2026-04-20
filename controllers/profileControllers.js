import "../services/externalApiService";
import '../services/profileService';
import {
    validateName,
    validateId,
    validateFilters
} from '../utils/validators';


const createProfile = async (req, res) =>{
    try {
        const { name } = req.body;

        // Validate name 
        const nameValidation = validateName(name);
        if (!nameValidation.valid) {
            return res.status(400).json({
                status: 'error',
                message: nameValidation.error
            })
        }

        // Check if profile already exists. 
        const existingProfile = await profileService.findProfileByName(nameValidation.name);

        if (existingProfile) {
            return res.status(200).json({
                status: 'success',
                message: 'Profile already exists',
                data: existingProfile
            });
        }

        // Enrich data from external APIs
        const enrichedData = await externalApiService.enrichProfile(nameValidation.name);

        // Create and store profile
        const profile = await profileService.createProfile(nameValidation.name, enrichedData);

        res.status(201).json({
            status: 'success',
            data: profile
        });
    
    } catch (error) {
        if (error.message.includes('Genderize') ||
            error.message.includes('Agify') ||
            error.message.includes('Nationalize')) {

            return res.status(502).json({
                status: 'error',
                message: error.message
            })
        }

        throw error;
    }
}


async function getProfileById(req, res) {
    const { id } = req.params;

    // Validate ID format 
    if (!validateId(id)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid ID format'
        })
    }

    const profile = await profileService.findProfileById(id);

    if (!profile) {
        return res.status(404).json({
            status: 'error',
            message: 'Profile not found'
        })
    }

    res.status(200).json({
        status: 'success',
        data: profile
    })
    
}

const getAllProfiles = async (req, res) => {
    const { gender, country_id, age_group } = req.query;

    // Validate filters
    const filterValidation = validateFilters(gender, country_id, age_group);
    if (!filterValidation.valid) {
        return res.status(400).json({
            status: 'error',
            message: filterValidation.error
        })
    }

    const filters = {}
    if (gender) filters.gender = gender;
    if (country_id) filters.country_id = country_id;
    if (age_group) filters.age_group = age_group;

    const profiles = await profileService.getAllProfiles(filters);

    res.status(200).json({
        status: 'success',
        count: profile.length,
        data: profiles
    });
}

const deleteProfile = async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if (!validateId(id)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid ID format'
        });
    }

    const deleted = await profileService.deleteProfile(id);

    if (!deleted) {
        return res.status(404).json({
            status: 'error',
            message: 'Profile not found'
        });
    }

    res.status(204).send();
}


export {
    createProfile,
    getProfileById,
    getAllProfiles,
    deleteProfile
}
