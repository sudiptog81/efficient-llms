async function fetchFromOpenAlex(doi) {
  // OpenAlex works with the DOI URL as ID:
  // https://api.openalex.org/works/https://doi.org/<doi>
  const id = encodeURIComponent(`https://doi.org/${doi}`);
  const url = `https://api.openalex.org/works/${id}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "parmanu/1.0" },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (typeof data?.cited_by_count === "number") {
    return { citations: data.cited_by_count, source: "openalex" };
  }
  return null;
}

async function fetchFromSemanticScholar(doi) {
  // Semantic Scholar Graph API:
  // https://api.semanticscholar.org/graph/v1/paper/DOI:<doi>?fields=citationCount
  const url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(
    doi
  )}?fields=citationCount`;

  const res = await fetch(url, {
    headers: { "User-Agent": "parmanu/1.0" },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (typeof data?.citationCount === "number") {
    return { citations: data.citationCount, source: "semanticscholar" };
  }
  return null;
}

export default async function handler(req, res) {
  const { doi } = req.query;

  if (!doi) {
    return res.status(400).json({ error: "Missing ?doi=" });
  }

  try {
    // 1) Try OpenAlex
    let result = await fetchFromOpenAlex(doi);

    // 2) Fallback to Semantic Scholar
    if (!result) {
      result = await fetchFromSemanticScholar(doi);
    }

    if (!result) {
      return res
        .status(404)
        .json({ doi, citations: null, source: null, error: "No data found" });
    }

    return res.status(200).json({
      doi,
      citations: result.citations,
      source: result.source,
    });
  } catch (err) {
    console.error("Citation lookup failed:", err);
    return res
      .status(500)
      .json({ doi, citations: null, source: null, error: "Lookup failed" });
  }
}
