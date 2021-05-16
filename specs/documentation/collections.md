# Collections Documentation

## Shelf Page

### Collection Button

onClick: redirect to “/collections”


## Collection Page

### Structure of “/collections”

Box grid of post-it like collections

Edit button on bottom right corner

### Edit Button

onClick: redirect to “/edit-collection”

query all current collections

display two buttons, add and delete

### Structure of “/edit-collection”

Box grid of post-it like collections

Green add button on bottom left corner

Red remove button on bottom right corner

### Add Button

onClick: prompt user for text submission of collection description

add collection schema with user’s text submission and no files to list of collections

### Delete Button

onClick: prompt user to click desired collection to delete (show box grid of post-it like collections that are each a button)

onClick (of collection button): get :col_id of that collection

action: display “Confirm?” button

onClick (of confirm button): delete using :col_id of collection clicked

### Clicking on a Collection

onClick: redirect to “/collections/:col_id”

## In “/collections/:col_id”

### Structure of “/collections/:col_id”

Description in a frame on top half of page

Edit description button right below the frame

Files displayed in box grid format on bottom half of page, each a button to view the file

Edit files button right below the files

### View Files

onClick: redirect to “/collections/:col_id/files”

### Structure of “/collections/:col_id/files”

Box grid format of all files

Two add buttons on bottom left corner, one for add image, one for add video

Remove button on bottom right corner

### Add Image Button

onClick: prompt user to upload image

onSubmit: query current list of image in collection of :col_id, add image file to list, update files list in schema with new images list 

### Add Video Button

onClick: prompt user to upload video

onSubmit: query current list of video in collection of :col_id, add video file to list, update files list in schema with new videos list 

### Delete File Button

onClick: prompt user to click desired file to delete

action: display “Confirm?” button

onClick: delete using :file_id of file clicked (“/collections/:col_id/files/:file_id)

### Edit Description

onClick: query current description of collection of :col_id, display text box prefilled with queried description, allow users to edit

onSubmit: set submitted text as description of collection of :col_id
