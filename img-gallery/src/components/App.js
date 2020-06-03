import React from 'react'
import { Image, Box, Flex, Text } from "@chakra-ui/core";

const dirTree = require("directory-tree");
const tree = dirTree("/Users/jordihermoso/code/portfolio/2020-typescript-v4/static",
	{ extensions: /\.(png|jpg|jpeg)$/ }, null, (item, PATH, stats) => {
		// console.log(item.children);
		// console.log(PATH);
		// console.log(stats);
	}
);

console.log('tree', tree)
// const test = Object.values(tree.children)
// console.log('test', test)

let itemPath
let itemName
let itemArr = []


console.log(tree)

function itemArrMaker(el) {
	el.children && el.children.length > 0 ? el.children.map(el2 => {
		itemArrMaker(el2)
	})
		: el.type != "directory" && itemArr.push({
			itemName: el.name,
			itemPath: el.path,
		})

}
itemArrMaker(tree)

console.log(itemArr)

const App = () => {

	// console.log(tree)

	return (
		<div className='app'>
			<h1>Image Gallery</h1>
			<p>This is will show all the apps within a directory</p>
			{/* <input directory="" webkitdirectory="" type="file" id="dir" onChange={(e) => console.log(e.target.files[0].path)} /> */}
			<Flex flexDir="row" flexWrap="wrap">
				{
					itemArr.map(item => {
						return (
							<Flex width="200px" flexDir="column" mr={4}>
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
