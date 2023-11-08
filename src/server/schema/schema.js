export function getBody (item) {
  if (item)
    return {
      title: item.title ?? 'no title',
      image: item.image
        ? item.image
        : 'https://static.vecteezy.com/system/resources/previews/005/337/799/large_2x/icon-image-not-found-free-vector.jpg',
      url: item.url ? item.url : '/',
			prediction: item.prediction
    }
		return {
			title: 'No title',
			image:
      'https://static.vecteezy.com/system/resources/previews/005/337/799/large_2x/icon-image-not-found-free-vector.jpg',
			url: '/',
			prediction: '0'
  }
}
