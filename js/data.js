const fetchAllCards = async () => {
  let cards = [];
  let folderIndex = 1;
  let hasMoreFolders = true;

  while (hasMoreFolders) {
    const folder = `data${folderIndex.toString().padStart(2, '0')}`;
    let fileIndex = 1;
    let folderHasFiles = false;

    while (fileIndex <= 99) {
      // Fetch in batches of 5 to improve performance
      const batchSize = Math.min(5, 99 - fileIndex + 1);
      const batchPromises = [];
      
      for (let i = 0; i < batchSize; i++) {
        const file = `data${(fileIndex + i).toString().padStart(2, '0')}.json`;
        batchPromises.push(
          fetch(`${folder}/${file}`)
            .then(res => {
              if (!res.ok) return null;
              return res.json();
            })
            .catch(() => null)
        );
      }

      const batchResults = await Promise.all(batchPromises);
      let batchHit404 = false;

      for (const data of batchResults) {
        if (data) {
          cards.push(data);
          folderHasFiles = true;
        } else {
          batchHit404 = true;
          break; // Stop processing this batch further, we found the end
        }
      }

      if (batchHit404) {
        break; // Reached the end of this folder
      }

      fileIndex += batchSize;
    }

    if (!folderHasFiles) {
      // If we didn't find any file in dataXX/data01.json, assume there are no more folders
      hasMoreFolders = false;
    } else {
      folderIndex++;
    }
  }

  return cards;
};

export { fetchAllCards };
