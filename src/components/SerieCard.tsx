import { Link } from "react-router-dom"
import type { Serie } from "../api/series"
import { mediaUrl } from "../api/variables"
import defaultCover from "../assets/img/Pandaman_Oda.jpg"

function SerieCard({ serie }: { serie: Serie }) {
    return (
        <Link
            onMouseOver={(event) => event.currentTarget.classList.add("hovered")}
            onMouseLeave={(event) => event.currentTarget.classList.remove("hovered")}
            onFocus={(event) => event.currentTarget.classList.add("hovered")}
            onBlur={(event) => event.currentTarget.classList.remove("hovered")}
            to={`/series/${serie.id}`}
            className="serie-list-item"
            style={{ backgroundImage: `url("${mediaUrl(serie.cover, defaultCover)}")` }}
        >
            <h3>{serie.title}</h3>
        </Link>
    )
}

export default SerieCard
