import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
	const {request, clearError, process, setProcess } = useHttp(); // states and method from custom hook

	const _apiBase = "https://gateway.marvel.com:443/v1/public/" // base of API

	const _apiKey = "apikey=c5d6fc8b83116d92ed468ce36bac6c62"; // key oF API
	const _baseOffset = 210; // offset


	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(
			`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
		);
		return res.data.results.map(_transformCharacter);
	};

	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
		return _transformCharacter(res.data.results[0]);
	};

	const _transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name,
			description: char.description 
				? `${char.description.slice(0, 210)}...`
				: "There is no description for this character",
			thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items,
		};
	};


	const getAllComics = async (offset = 0) => {
		const res = await request(
			`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
		);
		return res.data.results.map(_transformComics);
	};

	const getComic = async (id) => {// we are using sync await in every function because we are fetching
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`); // we use request method that we ve got from our custom hook it has loading and error inside of itself
		return _transformComics(res.data.results[0]);
	};

	const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			// optional chaining operator
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
		};
	};


	const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};
	

	return {
		process,
		setProcess,
		clearError,
		getAllCharacters,
		getCharacter,
		getAllComics,
		getComic,
		getCharacterByName
	}; // returning object with all methods we need
};

export default useMarvelService;