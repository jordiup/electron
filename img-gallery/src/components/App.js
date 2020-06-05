import React from 'react'
import { Image, Box, Flex, Text, Input } from "@chakra-ui/core";

const dirTree = require("directory-tree");

const App = () => {

	const [dirPath, setDirPath] = React.useState("/Users/jordihermoso/code/portfolio/2020-typescript-v4/static");
	const [itemArr, setItemArr] = React.useState([])

	const tree = dirTree(dirPath,
		{ extensions: /\.(png|jpg|jpeg)$/ }, null, (item, PATH, stats) => {
			// console.log(item.children);
		}
	);

	React.useEffect(() => {
		setItemArr([]) // clear the array
		itemArrMaker(tree) // init the tree

	}, [dirPath])

	console.log('tree', tree)
	// const test = Object.values(tree.children)

	function itemArrMaker(el) {
		el.children && el.children.length > 0 ? el.children.map(el2 => {
			itemArrMaker(el2)
		})
			: el.type != "directory" &&
			itemArr.push({
				itemName: el.name,
				itemPath: el.path,
			})

	}
	itemArrMaker(tree) // init the tree


	console.log(itemArr)

	// console.log(tree)


	return (
		<div className='app'>
			<h1>Image Gallery</h1>
			<p>This is will show all images within a directory</p>
			<Input variant="filled" placeholder="Enter a directory here" value={dirPath} onChange={e => setDirPath(e.target.value)} />
			<input directory="" webkitdirectory="" type="file" id="dir"
				// Strips the file name from the directory path
				onChange={(e) => setDirPath(e.target.files[0].path.replace(e.target.files[0].name, ''))}
			/>
			<Flex flexDir="row" flexWrap="wrap">
				{
					itemArr.map(item => {
						return (
							<Flex width="200px" flexDir="column" mr={4} key={item.itemName}>
								<Image size="200px" src={'file://' + item.itemPath} />
								<Text>{item.itemName}</Text>
							</Flex>)
					})
				}
			</Flex>
		</div>
	)
}

export default App
