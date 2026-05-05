import Button from '@/Components/Button';

export default function SecondaryButton({ className = '', ...props }) {
    return (
        <Button
            {...props}
            variant="white"
            className={className}
        />
    );
}
