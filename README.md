# comma cavalry

Cross platform app for labeling the [comma 10k](https://github.com/commaai/comma10k) dataset.

[Demo](https://comma-cavalry.netlify.app/)


### Setup

```
yarn install --frozen-lockfile
```

### Development

In browser 

```
# Run dev mode and point the server endpoint to prod
yarn dev:prod 
```

On iOS or Android

```
# Run dev mode and point the server endpoint to prod
yarn build
yarn cap open ios 
yarn cap open android
```

### Testing

```
yarn dev:prod

# in another terminal
yarn test
```

### Future improvements

* Add the ability to draw on layers

* Start off with an [automatically segmented image](https://colab.research.google.com/github/lexfridman/mit-deep-learning/blob/master/tutorial_driving_scene_segmentation/tutorial_driving_scene_segmentation.ipynb)


### Other notes

#### Depth maps

Made using intel's [MiDaS](https://github.com/intel-isl/MiDaS) depth detection model

Source | Map
:-------------:|:------------:
![source](https://raw.githubusercontent.com/commaai/comma10k/master/imgs/3917_b5e785c1fc446ed0_2018-06-18--08-35-24_12_1005.png)  |  ![map](https://ik.imagekit.io/ollopa/depth_maps/3917_b5e785c1fc446ed0_2018-06-18--08-35-24_12_1005_bfINQ13hY.jpg) |  

Applied filter
:-------------:
[depth map gif](https://media.giphy.com/media/kcgJmFq0uqvLrigFD0/giphy.gif)


```
# Notes

# Convert to jpg
for i in *.png; do mogrify -format jpg "$i" && rm "$i"; echo "$i converted to ${i%.*}.jpg"; done

# Compress
for i in *.jpg; do convert $i -sampling-factor 4:2:0 -strip -quality 85 -interlace JPEG -colorspace RGB $i; echo "compressed $i"; done
```
