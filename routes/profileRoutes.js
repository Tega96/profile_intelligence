import { Router } from 'express'
import { 
    allUsersProfile, 
    createProfile, 
    deleteProfile, 
    userProfile
} from '../controllers/profileControllers.js';

const router = Router();

router.get('/', allUsersProfile)
router.get('/:id', userProfile)
router.post('/', createProfile)
router.delete('/:id', deleteProfile)

export default router;