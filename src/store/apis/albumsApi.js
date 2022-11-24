import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {faker} from "@faker-js/faker";

// DEV ONLY!!!
const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

const albumsApi = createApi({
    reducerPath: 'albums',
    // RTQ ne koristi klasican ugradjeni fetch, nego je potrebno uraditi pocetnu konfiguraciju za fetch pre koriscenja
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005',
        fetchFn: async (...args) => {
            // REMOVE FOR PRODUCTION
            await pause(1000);
            return fetch(...args);
        }
    }),
    endpoints(builder) {
        return {
            removeAlbum: builder.mutation({
                invalidatesTags: (result, error, album) => {
                    return [{type: 'Album', id: album.id}];
                },
                query: (album) => {
                    return {
                        method: 'DELETE',
                        url: `/albums/${album.id}`,
                    };
                }
            }),
            addAlbum: builder.mutation({
                // Invalidira zadati Tag nakon dodavanja novog podatka.
                // Zbog para (string, id) u Tag-u, RTK zna tacno za kog usera treba da odradi ponovni re-fetch
                invalidatesTags: (result, error, user) => {
                    return [{type: 'UsersAlbums', id: user.id}];
                },
                query: (user) => {
                    return {
                        url: '/albums',
                        method: 'POST',
                        body: {
                            userId: user.id,
                            title: faker.commerce.productName()
                        }
                    }
                }
            }),
            fetchAlbums: builder.query({
                // Na osnovu Tag-a se vrsi re-fetching automatski nakon dodavanja novog podatka koji invalidira konkretan Tag.
                // Zbog para (string, id) u Tag-u, RTK zna tacno za kog usera treba da odradi ponovni re-fetch.
                providesTags: (result, error, user) => {
                    const tags = result.map((album) => {
                        return {type: 'Album', id: album.id}
                    });
                    tags.push({type: 'UsersAlbums', id: user.id});

                    return tags;
                },
                query: (user) => {
                    return {
                        url: '/albums',
                        params: {
                            userId: user.id,
                        },
                        method: 'GET',
                    };
                }
            })
        };
    }
});

export const {useFetchAlbumsQuery, useAddAlbumMutation, useRemoveAlbumMutation} = albumsApi;
export {albumsApi};