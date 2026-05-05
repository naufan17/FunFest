import Button from '@/Components/Button';

export default function DangerButton({ className = '', ...props }) {
    return (
        <Button
            {...props}
            variant="danger"
            className={className}
            i
        />
    );
}
