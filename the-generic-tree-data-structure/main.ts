import util from 'util'
import { Tree } from './tree'

const tree = new Tree<string>()
const d0: Tree<string>[] = []
const d1: Tree<string>[] = []
const d2: Tree<string>[] = []

// depth 0
d0.push(tree.insert('A'))

// depth 1
d1.push(tree.insert('B'))
d1.push(tree.insert('C'))
d1.push(tree.insert('D'))

// depth 2
d2.push(d1[0].insert('E'))
d2.push(d1[2].insert('F'))
d2.push(d1[2].insert('G'))

console.log(util.inspect(tree, false, null, true))
