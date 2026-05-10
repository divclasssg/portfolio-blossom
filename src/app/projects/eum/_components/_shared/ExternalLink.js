import Link from "next/link";

const VARIANT_CLASS = {
    primary: "link-primary",
    secondary: "link-secondary",
    elevated: "link-elevated",
};

export default function ExternalLink({ href, variant = "primary", children, className }) {
    const variantClass = VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary;
    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className ? `${variantClass} ${className}` : variantClass}
        >
            {children}
        </Link>
    );
}
