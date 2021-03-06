import React, { createContext, useContext, useState } from "react";

export let UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export let UserProvider = ({ children }) => {
	// estados y storage para el login
	const userStoraged = localStorage.user_name;
	const [userLogged, setUserLogged] = useState(userStoraged);

	const userThumbnailStoraged = localStorage.user_thumbnail;
	const [userThumbnail, setUserThumbnail] = useState(userThumbnailStoraged);

	const userEmailStoraged = localStorage.user_email;
	const [userEmail, setUserEmail] = useState(userEmailStoraged);

	// estados para favoritos
	const [favItem, setFavItem] = useState([]);

	const responseGoogle = (response) => {
		const infoLog = response.profileObj;

		setUserLogged(infoLog.name);
		localStorage.setItem("user_name", `${infoLog.name}`);

		setUserThumbnail(infoLog.imageUrl);
		localStorage.setItem("user_thumbnail", `${infoLog.imageUrl}`);

		setUserEmail(infoLog.email);
		localStorage.setItem("user_email", `${infoLog.email}`);
	};

	const logOut = () => {
		localStorage.clear();
		setUserLogged();
		setUserThumbnail();
		setUserEmail();
		setFavItem([]);
	};

	// favoritos

	const isInFav = (id) => {
		const inFav = favItem.find((x) => x.id === id);
		if (inFav !== undefined) {
			return true;
		}
		return false;
	};

	const addFav = (datos) => {
		isInFav(datos.id) === false && setFavItem([...favItem, { ...datos }]);
	};

	const removeFav = (item) => {
		const newFav = favItem.filter((x) => x.id !== item);
		setFavItem(newFav);
	};

	return (
		<UserContext.Provider
			value={{
				responseGoogle,
				userLogged,
				userThumbnail,
				userEmail,
				logOut,
				addFav,
				favItem,
				removeFav,
				isInFav,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
