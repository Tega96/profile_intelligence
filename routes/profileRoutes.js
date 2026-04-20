import { Router } from 'express'
import { 
    getProfileById,
    getAllProfiles,
    createProfile, 
    deleteProfile, 
} from '../controllers/profileControllers.js';

const router = Router();

router.get('/', getAllProfiles)
router.get('/:id', getProfileById)
router.post('/', createProfile)
router.delete('/:id', deleteProfile)

export default router;