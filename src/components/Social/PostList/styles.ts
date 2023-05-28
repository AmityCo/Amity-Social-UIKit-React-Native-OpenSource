import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  postWrap: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  headerSection: {
    paddingVertical: 8,
    flexDirection: 'row',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 15,
  },
  headerTextTime: {
    fontSize: 13,
    fontWeight: '400',
    color: '#636878',
    marginVertical: 4,
  },
  bodySection: {
    justifyContent: 'center',
    paddingVertical: 10,
    minHeight: 45,
  },
  countSection: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeCountText: {
    fontSize: 13,
    color: '#898E9E',
  },
  commentCountText: {
    fontSize: 13,
    color: '#898E9E',
  },
  bodyText: {
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  actionSection: {
    borderTopColor: '#EBECEF',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 4,
  },
  likeBtn: {
    flexDirection: 'row',
    paddingRight: 6,
    paddingVertical: 12,
  },
  commentBtn: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  btnText: {
    color: '#898E9E',
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 72,
    marginRight: 12,
    backgroundColor: '#D9E5FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likedText: {
    color: '#1054DE',
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginHorizontal: 4,
  },
  imageLargePost: {
    height: 350,
    borderRadius: 6,
  },
  imageMediumLargePost: {
    height: 235,
    borderRadius: 6,
  },
  imageMediumPost: {
    height: 182,
    borderRadius: 6,
  },
  imageSmallPost: {
    height: 120,
    borderRadius: 6,
  },
  imageMarginRight: {
    marginRight: 2,
  },
  imageMarginLeft: {
    marginLeft: 2,
  },
  imageMarginTop: {
    marginTop: 2,
  },
  imageMarginBottom: {
    marginBottom: 2,
  },
  imagesWrap: {
    display: 'flex',
    flex: 6,
    marginTop: 12,
    marginBottom: 4,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  col2: {
    flex: 2,
  },
  col3: {
    flex: 3,
  },
  col6: {
    flex: 6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 2,
    marginLeft: 2,
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default styles;
