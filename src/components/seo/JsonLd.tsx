/**
 * Component để render JSON-LD structured data
 * Sử dụng trong Server Components
 */

interface JsonLdProps {
    data: object;
}

export const JsonLd = ({ data }: JsonLdProps) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
};

