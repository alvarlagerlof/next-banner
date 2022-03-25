

function SomeComponent() {
    const {
        imgUrl = "https://default.image/url"
    } = getWindowData()

    return <>
        <img src={imgUrl} /> {/* Shows the default url */}
        <p>{imgUrl}</p>      {/* Shows the correct url from window */}
    </>
}






