import { uuidv7 } from 'uuid';
import db from '../db';
import { 
    formatProfileListRow,
    formatProfileRow,
    getAgeGroup
 } from '../utils/formatters';

 async function createProfile(name, enrichedData) {
    const id = uuidv7();
    const ageGroup = getAgeGroup(enrichedData.age);

    const query = `
        INSERT INTO profiles (
            id, name, gender, gender_probability, sample_size, age, age_group, country_id, country_probability, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP) RETURNING *
    `;

    const values = [
        id, 
        name.toLowerCase(),
        enrichedData.gender,
        enrichedData.gender_probability,
        enrichedData.sample_size,
        enrichedData.age,
        ageGroup,
        enrichedData.country_id,
        enrichedData.country_probability
    ];

    const result = await db.query(query, values);
    return formatProfileRow(result.rows[0]);
 }

 async function findProfileByName(name){
    const queryText = 'SELECT * FROM profiles WHERE name = $1';
    const result = await db.query(queryText, [name.toLowerCase()]);
    return result.rows[0] ? formatProfileRow(result.rows[0]) : null;
 }

 async function findProfileById(id) {
    const queryText = 'SELECT * FROM profiles WHERE id = $1';
    const result = await db.query(queryText, [id]);
    return result.rows[0] ? formatProfileRow(result.rows[0]) : null;
 }

 async function getAllProfiles(filters = {}) {
    let queryText = 'SELECT id, name, gender, age, age_group, country_id FROM profiles WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.gender) {
        queryText += ` AND gender = $${paramIndex}`;
        values.push(filters.gender.toLowerCase());
        paramIndex++;
    }

    if (filters.country_id) {
        queryText += ` AND country_id = $${paramIndex}`;
        values.push(filters.country_id.toUpperCase());
        paramIndex++;
    }

    if (filters.age_group) {
        queryText += ` AND age_group = $${paramIndex}`;
        values.push(filters.age_group.toLowerCase());
        paramIndex++;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, values);
    return result.rows.map(formatProfileListRow);

}

async function deleteProfile(id) {
    const queryText = `DELETE FROM profile WHERE id = $1 RETURNING id`;
    const result = await db.query(queryText, [id]);
    return result.rows.length > 0;
}

async function profileExists(name) {
    const profile = await findProfileByName(name);
    return !!profile;
}

export {
    createProfile,
    findProfileByName,
    findProfileById,
    getAllProfiles,
    deleteProfile, 
    profileExists
}

