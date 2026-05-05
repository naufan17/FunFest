import Button from '@/Components/Button';

export default function PrimaryButton({ className = '', ...props }) {
    return (
        <Button
            {...props}
            variant="primary"
            className={className}
        />
    );
}
