const data = Deno.readTextFileSync("data/input7.txt");

const testData = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

type Directory = {
  name: string;
  path: string;
  files: {[key: string]: number};
  directories: Set<string>;
  size?: number;
}

const getParentDir = (path: string): string => {
  return path.slice(0, path.slice(0, path.length - 1).lastIndexOf('/') + 1);
}

const describeFilesystem = (input: string): {[key: string]: Directory} => {
  const lines = input.split("\n");
  const root: Directory = {
    name: "/",
    path: "/",
    files: {},
    directories: new Set(),
  }
  const dirs: {[key: string]: Directory} = {
    "/": root,
  }
  let currentDir = root;
  for (const line of lines) {
    if (line.startsWith("$")) {
      const [_, ...rest] = line.split(" ");
      const command = rest[0];
      const args = rest.slice(1);
      if (command === "cd") {
        if (args.length !== 1) {
          throw new Error(`Unexpected cd command: ${line}`);
        }
        const newDirName = args[0];
        if (newDirName === "/") {
          currentDir = root;
        } else if (newDirName === "..") {
          const path = currentDir.path;
          const newPath = getParentDir(path);
          currentDir = dirs[newPath];
        } else {
          if (newDirName in dirs) {
            currentDir = dirs[newDirName];
          } else {
            const newDir: Directory = {
              name: newDirName,
              path: currentDir.path + newDirName + "/",
              files: {},
              directories: new Set(),
            }
            currentDir.directories.add(newDir.name);
            dirs[newDir.path] = newDir;
            currentDir = newDir;
          }
        }
      } else if (command === "ls") {
        if (args.length !== 0) {
          throw new Error(`Unexpected ls command: ${line}`);
        }
        // This doesn't do anything, since we already keep currentDir up to date
        // and we'll handle the lines following ls in the outer else clause.
      } else {
        throw new Error(`Unexpected command line: ${line}`);
      }
    } else {
      // Output from a previous `ls` command
      const parts = line.split(" ");
      if (parts.length !== 2) {
        throw new Error(`Unexpected line: ${line}`);
      }
      if (parts[0] === "dir") {
        currentDir.directories.add(parts[1]);
      } else {
        const [sizeString, name] = parts;
        const size = parseInt(sizeString);
        if (isNaN(size)) {
          throw new Error(`Improperly formed file line: ${line}`);
        }
        currentDir.files[name] = size;
      }
    }
  }
  return dirs;
}

const calculateSize = (dir: Directory, dirs: {[key: string]: Directory}): number => {
  let size = 0;
  for (const fileSize of Object.values(dir.files)) {
    size += fileSize;
  }
  for (const subDirName of dir.directories) {
    const subDirPath = dir.path + subDirName + "/";
    const subDir = dirs[subDirPath];
    if (subDir == undefined) {
      throw new Error(`Expected subDir to exist at ${subDirPath}`)
    }
    if (subDir.size == undefined) {
      throw new Error(`Must already have calculated size for all subdirectories at ${dir.path}`);
    }
    size += subDir.size;
  }
  return size;
}

const makeSearchStack = (dirs: {[key: string]: Directory}): {[key: number]: string[]} => {
  const searchStack: {[key: number]: string[]} = {};
  for (const dir of Object.values(dirs)) {
    const depth = dir.path.split("/").length - 1;
    if (!(depth in searchStack)) {
      searchStack[depth] = [];
    }
    searchStack[depth].push(dir.path);
  }
  return searchStack;
}

const getLeafiestDir = (searchStack: {[key: number]: string[]}): string => {
  const deepestLevel = parseInt(Object.keys(searchStack).sort((k) => -parseInt(k))[0]);
  const atThisLevel = searchStack[deepestLevel];
  delete searchStack[deepestLevel];
  const dir = atThisLevel.pop();
  if (dir == undefined) {
    throw new Error("Didn't expect an empty level in searchStack");
  }
  if (atThisLevel.length > 0) {
    searchStack[deepestLevel] = atThisLevel;
  }
  return dir;
}

// Using the terminal input, determine the structure of the filesystem, then
// find all directories with size <= 100000 and sum their sizes. I think this
// should just be construct the filesystem and then traverse it fully.
const calculateScore1 = (input: string): number => {
  const dirs = describeFilesystem(input);
  const searchStack = makeSearchStack(dirs);
  let totalSize = 0;
  // Go back up the tree, populating sizes as we go. Since we start with all
  // the leaf nodes we're guaranteed to always have cached sizes if we do it
  // in the right order.
  while (Object.keys(searchStack).length > 0) {
    const dirPath = getLeafiestDir(searchStack);
    if (dirPath == undefined) {
      throw new Error(`Expected ${dirPath} to be non-null`);
    }
    const dir = dirs[dirPath];
    dir.size = calculateSize(dir, dirs);
    if (dir.size < 100000) {
      totalSize += dir.size;
    }
  }
  return totalSize;
}

const calculateScore2 = (input: string): number => {
  const dirs = describeFilesystem(input);
  const searchStack = makeSearchStack(dirs);
  // Populate all directory sizes
  while (Object.keys(searchStack).length > 0) {
    const dirPath = getLeafiestDir(searchStack);
    if (dirPath == undefined) {
      throw new Error(`Expected ${dirPath} to be non-null`);
    }
    const dir = dirs[dirPath];
    dir.size = calculateSize(dir, dirs);
  }
  const toDelete = 30000000 - (70000000 - dirs["/"]?.size!);
  let min = 100000000000000;
  for (const dir of Object.values(dirs)) {
    if (dir.size! >= toDelete && dir.size! < min) {
      min = dir.size!;
    }
  }
  return min;
}

console.log(`Test score is: ${calculateScore1(testData)}`); // prints 95437
console.log(`Part 1: ${calculateScore1(data)}`);
console.log(`Test part 2 score is: ${calculateScore2(testData)}`);
console.log(`Part 2: ${calculateScore2(data)}`);