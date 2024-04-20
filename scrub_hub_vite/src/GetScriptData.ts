/**
 * This method is meant to assist in getting data from the Django view.
 * See the HTML template scrub_hub_frontend/index.html for what's required in there.
 * @param scriptId The id of the HTML script tag.
 */
export default function GetScriptData(scriptId: string = '_DjangoData_'): { [key: string]: unknown } {
	// We get the HTML document's script element and it's text content.
	const rawData = document.getElementById(scriptId)?.textContent;
	// Since the text content is a string we must parse it.
	return JSON.parse(rawData ?? '{}');
}
