import { DigiNavigationPagination } from "@digi/arbetsformedlingen-react"

import './Pagination.css';

type PaginationProps = {
    total: number;
    limit: number;
    onPageChange: (page: number) => void; 
    page: number;
};

export const Pagination = ({ total, limit, onPageChange, page }: PaginationProps) => {
    const totalPages = Math.ceil(total / limit)
        
    console.log(total)

    const handleChange = (event: CustomEvent<number>) => {
        onPageChange(event.detail); 
    };

    return (
        <DigiNavigationPagination
            afTotalPages={totalPages}
            afInitActivePage={page}
            afCurrentResultStart={(page - 1) * limit + 1}
            afCurrentResultEnd={Math.min(page * limit, total)}
            afTotalResults={total}
            afResultName="annonser"
            onAfOnPageChange={handleChange}
        >
        </DigiNavigationPagination>
    )
}