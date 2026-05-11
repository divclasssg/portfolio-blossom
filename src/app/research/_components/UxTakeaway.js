/**
 * Research 본문에서 반복되는 "UX Takeaway" 박스 프레임.
 * 내부 `<h3>UX Takeaway</h3>`는 자동으로 추가된다.
 *
 * @param {object} props
 * @param {import("react").ReactNode} props.children - p 태그들 (em 등 인라인 마크업 허용)
 */
export default function UxTakeaway({ children }) {
    return (
        <div className="ux-takeaway">
            <h3>UX Takeaway</h3>
            {children}
        </div>
    );
}
