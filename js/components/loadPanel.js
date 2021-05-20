export const loadingPanel = () => {

    const minuteHand = document.getElementById('minuteHand');
    const hourHand = document.getElementById('hourHand');
    const resourceLoader = document.getElementById('resource-loader');
    const sceneLoader = document.getElementById('scene-loader')

    const loaders = [];

    return ({
        addLoader: (loader) => loaders.push(loader),
        updateLoaded: ({ loaded, dynTotal, url }) => {

            //update the loader
            const updateIndex = loaders.findIndex(item => item.url === url);
            loaders[updateIndex].loaded = loaded;

            if(dynTotal) {

                loaders[updateIndex].total = dynTotal;

            } else {

                loaders[updateIndex].total = loaders[updateIndex].staticTotal;
            }

            //accumulate loaded & total
            const totalLoaded = loaders.reduce((acc, { loaded, total }) => ({
                total: acc.total + total,
                loaded: acc.loaded + loaded
            }), { total: 0, loaded: 0 });

            const { loaded: loadedTotal, total } = totalLoaded;
            const minuteLoaded = (loadedTotal / total) * 360;
            const hourLoaded = (((loadedTotal - total) / 10) / total) * 360;

            minuteHand.style.transform = `rotate(${minuteLoaded}deg)`;
            hourHand.style.transform = `rotate(${hourLoaded}deg)`;

            if(loadedTotal === total) {
                sceneLoader.style.display = 'block';
            }
        },
        show: () => {
            resourceLoader.style.display = `flex`;
        },
        hide: () => {
            resourceLoader.style.display = `none`;
        }
    });
};
