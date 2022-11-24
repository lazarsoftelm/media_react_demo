import {useFetchAlbumsQuery, useAddAlbumMutation, useRemoveAlbumMutation} from "../store";
import Skeleton from "./Skeleton";
import ExpandablePanel from "./ExpandablePanel";
import Button from "./Button";
import AlbumsListItem from "./AlbumsListItem";

function AlbumsList({user}) {
    const {data, error, isFetching} = useFetchAlbumsQuery(user);
    // addAlbum je funkcija kojom izvrsavamo mutaciju i poziv API-u
    const [addAlbum, result] = useAddAlbumMutation();
    const [removeAlbum, removeAlbumResult] = useRemoveAlbumMutation();

    //console.log(data, error, isLoading);

    const handleAddAlbum = () => {
        addAlbum(user);
    }

    let content;
    if (isFetching)
        content = <Skeleton className="h-10 w-full" times={3}/>
    else if (error)
        content = <div>Error loading albums.</div>
    else {
        content = data.map(album => {
            return <AlbumsListItem key={album.id} album={album}/>
        })
    }

    return <div>
        <div>
            <div className="m-2 flex flex-row items-center justify-between">
                <h3 className="text-lg font-bold">Albums for {user.name}</h3>
                <Button loading={result.isLoading} onClick={handleAddAlbum}>
                    + Add album
                </Button>
            </div>
        </div>
        <div>
            {content}
        </div>
    </div>
}

export default AlbumsList;
