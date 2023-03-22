# Getting Started with Create React App

This project was bootstrapped by Cam Burley.

## Getting started

run:

### `npm i`

then 

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Design Decisions

For this project, I followed the requirements and I wanted to save some time to work on at least one of the bonus items. I was able to do this.

I wanted the UI to look similar to a tree on VS code or similar so I was sure to include visual hierarchy in my component. The files vs folder icons are different and visually distinct. 

The bonus was to enable users to add new files or folders. I added a drop down menu to choose the object type ( file or folder ), then after adding a name and clicking "Add", the new object is added. 

I didn't spend any time on validating the form. With more time, that's something I would have considered. I could have made an alert or toast that alerts the user if the form is empty and they're pressing Add. 

The one tricky part was making a decision about how the Expand/Collapse logic would work in conjunction with adding new objects. My idea was to identify the expanded folder and last item clicked to serve as the insertion point for new objects. I needed to make assumptions if there is an Expand All / Collapse All button, because when expanded or collapsed, it's not clear where the insertion point should be. If collapsed, is the insertion point the root or does the last clicked folder persist and the insertion point is that folder? Same question, if everything is expanded. You could argue there is not a clear UX convention. 
These assumptions are pretty open to interpretation. I think this is the type of decision a team would make together with a UX designer.

I added a simple blue color to indicate a selected file or folder. The functions do a good job traversing the tree so feel free to make as many nested folders and files as needed. 

I looked at the eval criteria and the component satisfies all. I hope you like it. Happy to answer any questions! # forest
