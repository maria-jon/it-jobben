export type Job = {
    id: string;
    headline: string;
    application_deadline: string;
    description: {
        text: string;
        text_formatted: string;
        conditions: string;
    }
    employment_type: {
        label: string;
    }
    salary_type: {
        label: string;
    }
    salary_description: string;
    duration: {
        label: string;
    }
    working_hours_type: {
        label: string;
    }
    employer: {
        url: string;
        name: string;
        workplace: string;
    }
    application_details: {
        information: string;
        reference: string; 
        email: string;
        url: string;
    }
    experience_required: boolean;
    access_to_own_car: boolean;
    driving_license_required: boolean;
    occupation: {
        concept_id: string;
        label: string;
        legacy_ams_taxonomy_id: string;
    }
    occupation_group: {
        concept_id: string;
        label: string;
        legacy_ams_taxonomy_id: string;
    }
    workplace_address: {
        municipality: string;
        region: string;
        country: string;
        coordinates: [];
    }
    must_have: {
        skills: [];
        languages: [];
        work_experiences: [
            {
                concept_id: string;
                label: string;
                legacy_ams_taxonomy_id: string;    
            }
        ];
        education: [];
        education_level: [];
    }
    application_contacts: [
        {
            name: string;
            description: string;
            email: string;
            telephone: string;
            contact_type: string;
        }
    ];
    publication_date: string;
};