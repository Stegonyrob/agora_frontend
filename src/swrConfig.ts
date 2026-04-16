const swrConfig = {
  fetcher: (url: string) => {
    const token = localStorage.getItem("authToken");
    return fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
};

export default swrConfig;
