// 하트 아이콘 (Figma: heart, 25×24)
export default function HeartIcon({ size = 24, color = 'currentColor', className, ...rest }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 25 24"
            fill="none"
            aria-hidden="true"
            className={className}
            {...rest}
        >
            <path
                d="M12.5 21.3828C12.2559 21.3828 11.8848 21.1973 11.5918 21.0117C6.13281 17.4961 2.63672 13.375 2.63672 9.19531C2.63672 5.61133 5.11719 3.11133 8.23242 3.11133C10.166 3.11133 11.6309 4.19531 12.5 5.79688C13.3789 4.18555 14.834 3.11133 16.7773 3.11133C19.8926 3.11133 22.3633 5.61133 22.3633 9.19531C22.3633 13.375 18.8672 17.4961 13.4082 21.0117C13.1152 21.1973 12.7539 21.3828 12.5 21.3828Z"
                fill={color}
            />
        </svg>
    );
}
