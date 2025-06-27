import FeedPage from "../../../components/feeds/FeedPage";

export const dynamic = 'force-dynamic'; // Ensure this page is always dynamic

export default async function GlobalFeed() {
    return (
        <FeedPage />
    )

}