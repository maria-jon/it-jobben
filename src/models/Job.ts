export type Job = {
    id: string;
    headline: string;
    description: string;
    application_deadline: string;
    employer: {
        name: string;
        workplace: string;
    }
    occupation: {
        label: string;
    }
    publication_date: string;
};