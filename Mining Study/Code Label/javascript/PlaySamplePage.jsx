// DISCLAIMER: GITHUB COPILOT WAS USED TO HELP WITH THIS FILE
import { SafeAreaView, Text, View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { Rating } from 'react-native-ratings';

import {
	styles,
	additionalStyles,
	colors,
	mode,
	isDark,
} from '../styles/styles';
import utils from '../config/utils';

import NearbyAndPlayHeader from '../components/NearbyAndPlayHeader';
import UserContainer from '../components/UserContainer';
import ErrorText from '../components/ErrorText';
import ActiveBtn from '../components/ActiveBtn';

import ratingsService from '../services/ratings';

/**
 * Page for playing a sample, using a WebView.
 *
 * Also allows user to rate the sample.
 *
 * @param {Object} route Routing information for Tab stacks
 * @param {Object} navigation Navigation actions for Tab stacks
 * @returns {JSX.Element}
 */
const PlaySamplePage = ({ route, navigation }) => {
	// For webview to work, we need to use a state variable to track if the
	// navigation has transitioned. This is because the webview will not load
	// if it is not visible on the screen.
	const [hasNavigationTransitioned, setHasNavigationTransitioned] =
		useState(false);
	const [webState, setWebState] = useState({
		loaded: false,
		actioned: false,
	});

	// Tracks if the user has rated the song at least once already
	const [hasRated, setHasRated] = useState(false);

	// Tracks the user's current rating of the song
	const [currRating, setCurrRating] = useState(null);

	// True if an error arises when switching between pages, requiring a reload
	// of the page to play the song
	const [reloadErr, setReloadErr] = useState(false);

	const { nearbyMusic, currProfile, currSongSample } = route.params;
	const webRef = useRef();

  // Used to fix WebView crashing when wrapped by a View. Obtained from BDDev.
  // Link: https://github.com/react-native-webview/react-native-webview/issues/811
	useEffect(
		() =>
			navigation.addListener('transitionEnd', () => {
				setHasNavigationTransitioned(true);
			}),
		[navigation, setHasNavigationTransitioned]
	);

	useEffect(
		() =>
			navigation.addListener('blur', () => {
				setHasNavigationTransitioned(false);
			}),
		[navigation, setHasNavigationTransitioned]
	);

	/**
	 * Stringifies JS code to play the song.
	 *
	 * This is necessary because the song data is retrieved from the API as an
	 * object, and we need to pass it into the WebView as a string.
	 *
	 * @param {Object} songData Song recording data retrieved from api
	 * @param {String} songType Song type (e.g. 'Guitar')
	 * @returns {String} Stringified JS code to play the song
	 */
	const stringifiedPlaySong = (songData, songType) => {
		const strJsCode = `function playSong() {
            songData = JSON.parse(${JSON.stringify(songData)});
            preparePreview(songData, ${JSON.stringify(songType).toLowerCase()});
            playPreview();
    };
            playSong();`;

		return strJsCode;
	};

	/**
	 * Handles the user's request to play or stop the song.
	 *
	 * Song data and instrument type is based on the retrieved api data.
	 */
	const handleWebActionPress = () => {
		if (!webState.loaded) return;
		if (!webRef.current) return setReloadErr(true);

    // If the song is not recorded, play the default song given by the uri
		if (!currSongSample.recording_data) {
			webRef.current.injectJavaScript(
				!webState.actioned ? 'playSong()' : 'stopSong()'
			);
		} else {
			webRef.current.injectJavaScript(
				!webState.actioned
					? stringifiedPlaySong(
							currSongSample.recording_data,
							currSongSample.type
					  )
					: 'stopSong()'
			);
		}
		setWebState({
			...webState,
			actioned: !webState.actioned,
		});
	};

	/**
	 * Creates or updates the user's rating of the song based on the Ratings
	 * component.
	 *
	 * @param {Number} rating Rating value of the song
	 * @returns {Number} Newly created or updated rating value
	 */
	const handleRatingChange = async rating => {
		// If user hasn't rated yet, POST rating
		if (!hasRated) {
			const createdRating = await ratingsService.createRating(
				currSongSample.id,
				rating
			);
			setHasRated(true);
			return createdRating;
		}

		// Otherwise, PUT rating
		const updatedRating = await ratingsService.editRating(
			currRating.id,
			rating
		);
		return updatedRating;
	};

	return (
		<SafeAreaView style={styles.nearbyAndPlayContainer}>
			<NearbyAndPlayHeader
				locationName={!nearbyMusic ? null : nearbyMusic.name}
			/>
			<Text style={styles.songName}>{currSongSample.name}</Text>

			{/* WebView will only load after page has completed transition */}
			<View>
				{hasNavigationTransitioned && (
					<WebView
						ref={ref => (webRef.current = ref)}
						originWhitelist={['*']}
						source={{
							uri: utils.PLAY_TONE_URL,
						}}
						pullToRefreshEnabled={true}
						onLoad={() =>
							setWebState({
								...webState,
								loaded: true,
							})
						}
					/>
				)}
			</View>

			<ActiveBtn
				onPress={handleWebActionPress}
				text={webState.actioned ? 'Stop Music' : 'Play Music'}
				touchableStyles={styles.playButton}
				textStyles={{ fontWeight: 'bold' }}
			/>

			<Rating
				style={styles.ratingComponentAdjustable}
				type="custom"
				tintColor={isDark ? colors[mode].bgColor : null}
				ratingCount={5}
				imageSize={30}
				fractions={1}
				startingValue={2.5}
				onFinishRating={handleRatingChange}
			/>

			{/* Pop up msg will be displayed to illustrate if WebView has loaded
          yet OR if the page needs to be exited for music to play */}
			<ErrorText
				condition={!webState.loaded || reloadErr}
				text={
					!webState.loaded
						? utils.WEBVIEW_NOT_LOADED_MSG
						: utils.RELOAD_TO_PLAY_MSG
				}
				addedStyles={{ marginTop: 10, textAlign: 'center' }}
			/>

			<View style={additionalStyles.currentLocationStatusContainer}>
				<Text style={additionalStyles.currentLocationStatusHeading}>
					Currently At This Location
				</Text>
				<UserContainer
					profilePic={currProfile.profilePic}
					userName={currProfile.name || 'Add a name in the profile page.'}
				/>
				<UserContainer />
			</View>
		</SafeAreaView>
	);
};

export default PlaySamplePage;
