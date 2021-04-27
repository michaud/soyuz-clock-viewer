export const loadingPanel = (loader, minuteHand, hourHand) => {

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
            const totalLoaded = loaders.reduce((acc, { loaded, total }) => {

                const newAcc = {
                    total: acc.total + total,
                    loaded: acc.loaded + loaded
                }

                return newAcc;

            }, {total: 0, loaded: 0 });

            const { loaded: loadedTotal, total } = totalLoaded;
            const minuteLoaded = (loadedTotal / total) * 360;
            const hourLoaded = (((loadedTotal - total) / 10) / total) * 360;

            minuteHand.style.transform = `rotate(${minuteLoaded}deg)`;
            hourHand.style.transform = `rotate(${hourLoaded}deg)`;

            if(loadedTotal === total) loader.style.display = `none`;

        },
        show: () => {
            loader.style.display = `block`;
        },
        hide: () => {
            loader.style.display = `none`;
        }
    });
};
