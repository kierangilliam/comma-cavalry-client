# comma cavalry

Cross platform app for labeling the [comma 10k](https://github.com/commaai/comma10k) dataset.

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

* Generate better depth maps & smooth the depth map filter

* Optimize autoLine to be performant on mobile

### Other notes

#### Depth maps

Source | Map | Applied filter
:-------------:|:------------:|:-------------------------:
![source](https://raw.githubusercontent.com/commaai/comma10k/master/imgs/3917_b5e785c1fc446ed0_2018-06-18--08-35-24_12_1005.png)  |  ![map](https://ik.imagekit.io/ollopa/3917_b5e785c1fc446ed0_2018-06-18--08-35-24_12_1005_22oJYOoXu.jpg) |  [depth map gif](https://github.com/kierangilliam/comma-cavalry-client/raw/master/.github/depth-map.gif)


```
# Convert to jpg
for i in *.png; do mogrify -format jpg "$i" && rm "$i"; echo "$i converted to ${i%.*}.jpg"; done

# Convert using http://stereo.jpn.org/jpn/stphmkr/google/colabe.html

# Download and get cropped right half
for i in *.jpg; do convert -crop 50%x100% +repage "$i" "$i"; echo "$i cropped"; mv ${i%.*}-1.jpg $i; rm ${i%.*}-0.jpg; done
```
