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

// console.log('tree', tree)
// const test = Object.values(tree.children)
// console.log('test', test)

let itemPath
let itemName
let itemArr = []

tree.children.map(el => {

	el.children.length > 0 ? el.children.map(el2 => {
		itemArr.push({
			itemName: el2.name,
			itemPath: el2.path,
		})
	})
		: null

})

console.log(itemArr)

const App = () => {

	// console.log(tree)

	return (
		<div className='app'>
			<h1>React Electron Boilerplate</h1>
			<p>This is a simple boilerplate for using React with Electron</p>
			<Image size="200px" src="file:///Users/jordihermoso/code/portfolio/2020-typescript-v4/static/hero-grid-imgs/0.jpg" />
			<Flex flexDir="row" flexWrap="wrap">
				{
					itemArr.map(item => {
						return (
							<Flex width="200px" flexDir="column">
								<Image width="200px" src={'file://' + item.itemPath} />
								<Text>{item.itemName}</Text>
							</Flex>)
					})
				}
			</Flex>
		</div>
	)
}

export default App
