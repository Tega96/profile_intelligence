function formatProfileRow(row) {
    if (!row) return null;

    return {
        id: row.id,
        name: row.name,
        gender: row.gender,
        gender_probability: parseFloat(row.gender_probability),
        sample_size: row.sample_size,
        age: row.age,
        age_group: row.age_group,
        country_id: row.country_id,
        country_probability: parseFloat(row.country_probability),
        created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
    };
}

function formatProfileListRow(row) {
    return {
        id: row.id,
        name: row.name,
        gender: row.gender,
        age: row.age,
        age_group: row.age_group,
        country_id: row.country_id
    };
}

function getAgeGroup(age) {
    if (age >= 0 && age <= 12) return 'child';
    if (age >= 13 && age <= 19) return 'teenager';
    if (age >= 20 && age <= 59) return 'adult';
    return 'senior';
}

export {
    formatProfileRow,
    formatProfileListRow,
    getAgeGroup
}