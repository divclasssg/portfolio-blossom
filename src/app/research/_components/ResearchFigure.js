/**
 * Research 본문의 figure + picture + (optional source) + img + figcaption 프레임.
 *
 * @param {object} props
 * @param {string} props.src - img.src
 * @param {string} [props.srcSet] - 있으면 <source srcSet>로 추가, 없으면 source 생략
 * @param {string} props.alt - 스크린 리더용 (장식 이미지가 아닌 본문 figure이므로 의미 있는 텍스트)
 * @param {number} props.width
 * @param {number} props.height
 * @param {import("react").ReactNode} props.caption
 * @param {"lazy" | "eager"} [props.loading="lazy"]
 */
export default function ResearchFigure({
    src,
    srcSet,
    alt,
    width,
    height,
    caption,
    loading = "lazy",
}) {
    return (
        <figure>
            <picture>
                {srcSet && <source srcSet={srcSet} />}
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={loading}
                />
            </picture>
            <figcaption>{caption}</figcaption>
        </figure>
    );
}
