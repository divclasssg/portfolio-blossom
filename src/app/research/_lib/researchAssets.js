import { asset } from "@/_lib/media";

/**
 * Research 페이지의 자산 URL 헬퍼를 생성한다.
 *
 * @param {string} slug - 페이지 슬러그 (예: "autonomous-vehicle-trust-ux")
 * @param {object} options
 * @param {"jpg-srcset" | "webp"} options.format
 *   - "jpg-srcset": 본문 figure가 `_1x.jpg`/`_2x.jpg` 짝으로 제공됨
 *   - "webp": 본문 figure가 단일 `.webp`로 제공됨
 *   cover.webp는 두 형식 모두 동일하다.
 * @returns {{
 *   coverSrc: () => string,
 *   figureSrc: (name: string) => string,
 *   figureSrcSet: (name: string) => (string | undefined),
 * }}
 */
export function createResearchAssets(slug, { format }) {
    const base = `research/${slug}`;

    const coverSrc = () => asset(`${base}/cover.webp`);

    switch (format) {
        case "jpg-srcset":
            return {
                coverSrc,
                figureSrc: (name) => asset(`${base}/${name}_1x.jpg`),
                figureSrcSet: (name) =>
                    `${asset(`${base}/${name}_1x.jpg`)} 1x, ${asset(`${base}/${name}_2x.jpg`)} 2x`,
            };
        case "webp":
            return {
                coverSrc,
                figureSrc: (name) => asset(`${base}/${name}.webp`),
                figureSrcSet: () => undefined,
            };
        default:
            throw new Error(
                `createResearchAssets: unknown format "${format}". Expected "jpg-srcset" | "webp".`
            );
    }
}
