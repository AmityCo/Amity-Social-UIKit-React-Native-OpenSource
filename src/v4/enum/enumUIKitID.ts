export enum PageID {
  CameraPage = 'camera_page',
  StoryPage = 'story_page',
  CreateStoryPage = 'create_story_page',
  WildCardPage = '*',
  social_home_page = 'social_home_page',
  global_search_page = 'global_search_page',
  post_detail_page = 'post_detail_page',
  social_global_search_page = 'social_global_search_page',
  post_composer_page = 'post_composer_page',
  select_post_target_page = 'select_post_target_page',
  select_story_target_page = 'select_story_target_page',
}
export enum ComponentID {
  EditComment = 'edit_comment_component',
  HyperLinkConfig = 'hyper_link_config_component',
  CommentTray = 'comment_tray_component',
  StoryTab = 'story_tab_component',
  WildCardComponent = '*',
  top_navigation = 'top_navigation',
  empty_newsfeed = 'empty_newsfeed',
  my_communities = 'my_communities',
  newsfeed_component = 'newsfeed_component',
  global_feed_component = 'global_feed_component',
  post_content = 'post_content',
  top_search_bar = 'top_search_bar',
  community_search_result = 'community_search_result',
  media_attachment = 'media_attachment',
  detailed_media_attachment = 'detailed_media_attachment',
  create_post_menu = 'create_post_menu',
}
export enum ElementID {
  CloseBtn = 'close_button',
  AspectRatioBtn = 'aspect_ratio_button',
  StoryHyperLinkBtn = 'story_hyperlink_button',
  HyperLink = 'hyper_link',
  ShareStoryBtn = 'share_story_button',
  ProgressBar = 'progress_bar',
  OverFlowMenu = 'overflow_menu',
  StoryImpressionBtn = 'story_impression_button',
  StoryCommentBtn = 'story_comment_button',
  StoryReactionBtn = 'story_reaction_button',
  CreateNewStoryBtn = 'create_new_story_button',
  SpeakerBtn = 'speaker_button',
  CancelBtn = 'cancel_button',
  SaveBtn = 'save_button',
  DoneBtn = 'done_button',
  StoryRing = 'story_ring',
  WildCardElement = '*',
  header_label = 'header_label',
  global_search_button = 'global_search_button',
  post_creation_button = 'post_creation_button',
  newsfeed_button = 'newsfeed_button',
  explore_button = 'explore_button',
  my_communities_button = 'my_communities_button',
  illustration = 'illustration',
  title = 'title',
  description = 'description',
  explore_communities_button = 'explore_communities_button',
  create_community_button = 'create_community_button',
  community_avatar = 'community_avatar',
  community_display_name = 'community_display_name',
  community_private_badge = 'community_private_badge',
  community_official_badge = 'community_official_badge',
  community_category_name = 'community_category_name',
  community_members_count = 'community_members_count',
  back_button = 'back_button',
  menu_button = 'menu_button',
  moderator_badge = 'moderator_badge',
  timestamp = 'timestamp',
  post_content_view_count = 'post_content_view_count',
  reaction_button = 'reaction_button',
  comment_button = 'comment_button',
  share_button = 'share_button',
  search_icon = 'search_icon',
  clear_button = 'clear_button',
  cancel_button = 'cancel_button',
  create_new_post_button = 'create_new_post_button',
  edit_post_button = 'edit_post_button',
  edit_post_title = 'edit_post_title',
  camera_button = 'camera_button',
  image_button = 'image_button',
  video_button = 'video_button',
  file_button = 'file_button',
  detailed_button = 'detailed_button',
  create_post_button = 'create_post_button',
  create_story_button = 'create_story_button',
  create_poll_button = 'create_poll_button',
  create_livestream_button = 'create_livestream_button',
  my_timeline_avatar = 'my_timeline_avatar',
  my_timeline_text = 'my_timeline_text',
  close_button = 'close_button',
}

export interface UiKitConfigKeys {
  title?: string;
  text?: string;
  back_icon?: string;
  resolution?: string;
  close_icon?: string;
  background_color?: string;
  aspect_ratio_icon?: string;
  hyperlink_button_icon?: string;
  share_icon?: string;
  hide_avatar?: boolean;
  progress_color?: [string, string];
  overflow_menu_icon?: string;
  impression_icon?: string;
  comment_icon?: string;
  reaction_icon?: string;
  create_new_story_icon?: string;
  mute_icon?: string;
  unmute_icon?: string;
  cancel_icon?: string;
  cancel_button_text?: string;
  save_icon?: string;
  save_button_text?: string;
  done_icon?: string;
  done_button_text?: string;
  icon?: string;
  image?: string;
}

export enum DefaultConfigID {
  SelectTargetPage = 'select_target_page/*/*',
  CameraPage = 'camera_page/*/*',
  StoryPage = 'story_page/*/*',
  CreateStoryPage = 'create_story_page/*/*',
  EditComment = '*/edit_comment_component/*',
  HyperLinkConfig = '*/hyper_link_config_component/*',
  CommentTray = '*/comment_tray_component/*',
  StoryTab = '*/story_tab_component/*',
  BackBtnOnSelectTargetPage = 'select_target_page/*/back_button',
  CloseBtnOnCameraPage = 'camera_page/*/close_button',
  BackBtnOnCreateStoryPage = 'create_story_page/*/back_button',
  AspectRatioBtnOnCreateStoryPage = 'create_story_page/*/aspect_ratio_button',
  StoryHyperLinkBtnOnCreateStoryPage = 'create_story_page/*/story_hyperlink_button',
  HyperLinkOnCreateStoryPage = 'create_story_page/*/hyper_link',
  ShareStoryBtnOnCreateStoryPage = 'create_story_page/*/share_story_button',
  ProgressBarOnCreateStoryPage = 'story_page/*/progress_bar',
  OverFlowMenuOnStoryPage = 'story_page/*/overflow_menu',
  CloseBtnOnStoryPage = 'story_page/*/close_button',
  StoryImpressionBtnOnStoryPage = 'story_page/*/story_impression_button',
  StoryCommentBtnOnStoryPage = 'story_page/*/story_comment_button',
  StoryReactionBtnOnStoryPage = 'story_page/*/story_reaction_button',
  CreateNewStoryBtnOnStoryPage = 'story_page/*/create_new_story_button',
  SpeakerBtnOnStoryPage = 'story_page/*/speaker_button',
  CancelBtnOnEditComment = '*/edit_comment_component/cancel_button',
  SaveBtnOnEditComment = '*/edit_comment_component/save_button',
  DoneBtnOnHyperLinkConfig = '*/hyper_link_config_component/done_button',
  CancelBtnOnHyperLinkConfig = '*/hyper_link_config_component/cancel_button',
  StoryRingOnStoryTab = '*/story_tab_component/story_ring',
  CreateNewStoryBtnOnStoryTab = '*/story_tab_component/create_new_story_button',
  CloseBtnOnAllPage = '*/*/close_button',
}
