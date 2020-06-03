/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 80020
Source Host           : localhost:3306
Source Database       : pet_battle

Target Server Type    : MYSQL
Target Server Version : 80020
File Encoding         : 65001

Date: 2020-06-04 01:45:06
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for friend_chat
-- ----------------------------
DROP TABLE IF EXISTS `friend_chat`;
CREATE TABLE `friend_chat` (
  `id` char(32) NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `send_time` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `my_user_id` (`sender_id`),
  KEY `friend_user_id` (`receiver_id`),
  CONSTRAINT `friend_chat_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friend_chat_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of friend_chat
-- ----------------------------

-- ----------------------------
-- Table structure for friend_mapper
-- ----------------------------
DROP TABLE IF EXISTS `friend_mapper`;
CREATE TABLE `friend_mapper` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inviter_id` int NOT NULL,
  `invitee_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `my_user_id` (`inviter_id`),
  KEY `friend_user_id` (`invitee_id`),
  CONSTRAINT `friend_mapper_ibfk_1` FOREIGN KEY (`inviter_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friend_mapper_ibfk_2` FOREIGN KEY (`invitee_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of friend_mapper
-- ----------------------------
INSERT INTO `friend_mapper` VALUES ('14', '10000003', '10000008');

-- ----------------------------
-- Table structure for shop_goods
-- ----------------------------
DROP TABLE IF EXISTS `shop_goods`;
CREATE TABLE `shop_goods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `goods_id` int NOT NULL,
  `goods_type` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `currency` varchar(8) NOT NULL,
  `price` int NOT NULL,
  `single_buy` int NOT NULL,
  `max_buy` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shop_goods
-- ----------------------------
INSERT INTO `shop_goods` VALUES ('1', '6004', 'pet', 'coin', '10000', '1', '5');
INSERT INTO `shop_goods` VALUES ('2', '6005', 'pet', 'diamond', '500', '1', '3');
INSERT INTO `shop_goods` VALUES ('3', '6006', 'pet', 'diamond', '2000', '1', '1');
INSERT INTO `shop_goods` VALUES ('4', '6095', 'pet', 'diamond', '5000', '1', '1');
INSERT INTO `shop_goods` VALUES ('5', '6115', 'pet', 'diamond', '5000', '1', '1');
INSERT INTO `shop_goods` VALUES ('6', '6131', 'pet', 'diamond', '2000', '1', '1');
INSERT INTO `shop_goods` VALUES ('7', '6133', 'pet', 'diamond', '2000', '1', '1');
INSERT INTO `shop_goods` VALUES ('8', '1001', 'prop', 'coin', '2000', '5', '100');
INSERT INTO `shop_goods` VALUES ('9', '1002', 'prop', 'coin', '5000', '5', '50');
INSERT INTO `shop_goods` VALUES ('10', '1003', 'prop', 'diamond', '200', '1', '30');
INSERT INTO `shop_goods` VALUES ('11', '1004', 'prop', 'diamond', '1000', '1', '10');
INSERT INTO `shop_goods` VALUES ('12', '2041', 'prop', 'diamond', '100', '1', '10');
INSERT INTO `shop_goods` VALUES ('13', '2042', 'prop', 'diamond', '100', '1', '10');
INSERT INTO `shop_goods` VALUES ('14', '2001', 'prop', 'diamond', '30', '3', '30');
INSERT INTO `shop_goods` VALUES ('15', '2002', 'prop', 'diamond', '30', '3', '30');
INSERT INTO `shop_goods` VALUES ('16', '2003', 'prop', 'diamond', '30', '3', '30');
INSERT INTO `shop_goods` VALUES ('17', '2011', 'prop', 'diamond', '60', '3', '20');
INSERT INTO `shop_goods` VALUES ('18', '2012', 'prop', 'diamond', '60', '3', '20');
INSERT INTO `shop_goods` VALUES ('19', '2013', 'prop', 'diamond', '60', '3', '20');
INSERT INTO `shop_goods` VALUES ('20', '2021', 'prop', 'diamond', '90', '3', '10');
INSERT INTO `shop_goods` VALUES ('21', '2022', 'prop', 'diamond', '90', '3', '10');
INSERT INTO `shop_goods` VALUES ('22', '2023', 'prop', 'diamond', '90', '3', '10');
INSERT INTO `shop_goods` VALUES ('23', '2031', 'prop', 'diamond', '50', '1', '15');
INSERT INTO `shop_goods` VALUES ('24', '2032', 'prop', 'diamond', '100', '1', '10');
INSERT INTO `shop_goods` VALUES ('25', '2033', 'prop', 'diamond', '150', '1', '5');
INSERT INTO `shop_goods` VALUES ('26', '1011', 'prop', 'diamond', '50', '1', '20');
INSERT INTO `shop_goods` VALUES ('27', '1021', 'prop', 'diamond', '200', '1', '5');
INSERT INTO `shop_goods` VALUES ('28', '6017', 'pet', 'diamond', '2000', '1', '1');
INSERT INTO `shop_goods` VALUES ('29', '6104', 'pet', 'diamond', '2000', '1', '1');
INSERT INTO `shop_goods` VALUES ('30', '6113', 'pet', 'diamond', '5000', '1', '1');
INSERT INTO `shop_goods` VALUES ('31', '6140', 'pet', 'diamond', '5000', '1', '1');
INSERT INTO `shop_goods` VALUES ('32', '3001', 'equipment', 'coin', '10000', '1', '50');
INSERT INTO `shop_goods` VALUES ('33', '3011', 'equipment', 'coin', '10000', '1', '50');
INSERT INTO `shop_goods` VALUES ('34', '3021', 'equipment', 'coin', '10000', '1', '50');
INSERT INTO `shop_goods` VALUES ('35', '3031', 'equipment', 'coin', '10000', '1', '50');
INSERT INTO `shop_goods` VALUES ('36', '3041', 'equipment', 'coin', '10000', '1', '50');
INSERT INTO `shop_goods` VALUES ('37', '3051', 'equipment', 'coin', '10000', '1', '50');
INSERT INTO `shop_goods` VALUES ('38', '3002', 'equipment', 'diamond', '200', '1', '30');
INSERT INTO `shop_goods` VALUES ('39', '3012', 'equipment', 'diamond', '200', '1', '30');
INSERT INTO `shop_goods` VALUES ('40', '3022', 'equipment', 'diamond', '200', '1', '30');
INSERT INTO `shop_goods` VALUES ('41', '3032', 'equipment', 'diamond', '200', '1', '30');
INSERT INTO `shop_goods` VALUES ('42', '3042', 'equipment', 'diamond', '200', '1', '30');
INSERT INTO `shop_goods` VALUES ('43', '3052', 'equipment', 'diamond', '200', '1', '30');
INSERT INTO `shop_goods` VALUES ('44', '3003', 'equipment', 'diamond', '500', '1', '10');
INSERT INTO `shop_goods` VALUES ('45', '3013', 'equipment', 'diamond', '500', '1', '10');
INSERT INTO `shop_goods` VALUES ('46', '3023', 'equipment', 'diamond', '500', '1', '10');
INSERT INTO `shop_goods` VALUES ('47', '3033', 'equipment', 'diamond', '500', '1', '10');
INSERT INTO `shop_goods` VALUES ('48', '3043', 'equipment', 'diamond', '500', '1', '10');
INSERT INTO `shop_goods` VALUES ('49', '3053', 'equipment', 'diamond', '500', '1', '10');

-- ----------------------------
-- Table structure for user_embattle
-- ----------------------------
DROP TABLE IF EXISTS `user_embattle`;
CREATE TABLE `user_embattle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `user_pet_id` int NOT NULL,
  `sequence_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `user_pet_id` (`user_pet_id`),
  CONSTRAINT `user_embattle_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_embattle_ibfk_2` FOREIGN KEY (`user_pet_id`) REFERENCES `user_pet` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=521 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_embattle
-- ----------------------------
INSERT INTO `user_embattle` VALUES ('508', '10000003', '1370', '0');
INSERT INTO `user_embattle` VALUES ('510', '10000008', '1373', '0');
INSERT INTO `user_embattle` VALUES ('511', '10000008', '1377', '1');
INSERT INTO `user_embattle` VALUES ('512', '10000008', '1371', '2');
INSERT INTO `user_embattle` VALUES ('513', '10000008', '1372', '3');
INSERT INTO `user_embattle` VALUES ('514', '10000008', '1375', '4');
INSERT INTO `user_embattle` VALUES ('515', '10000008', '1378', '5');
INSERT INTO `user_embattle` VALUES ('516', '10000003', '1381', '1');
INSERT INTO `user_embattle` VALUES ('517', '10000003', '1385', '2');
INSERT INTO `user_embattle` VALUES ('518', '10000003', '1386', '3');
INSERT INTO `user_embattle` VALUES ('519', '10000003', '1383', '4');
INSERT INTO `user_embattle` VALUES ('520', '10000003', '1382', '5');

-- ----------------------------
-- Table structure for user_equipment
-- ----------------------------
DROP TABLE IF EXISTS `user_equipment`;
CREATE TABLE `user_equipment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `equipment_id` int NOT NULL,
  `main_status` varchar(255) NOT NULL,
  `vice_status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `strength_level` int NOT NULL DEFAULT '0',
  `star_level` int NOT NULL DEFAULT '0',
  `user_pet_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `user_equipment_ibfk_2` (`user_pet_id`),
  CONSTRAINT `user_equipment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=378 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_equipment
-- ----------------------------
INSERT INTO `user_equipment` VALUES ('353', '10000003', '3043', '{\"attack\":49}', '{\"hp\":198,\"critRate\":12,\"speed\":11}', '5', '0', '0');
INSERT INTO `user_equipment` VALUES ('354', '10000003', '3053', '{\"resist\":25}', '{\"defend\":15,\"critRate\":8,\"speed\":13}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('355', '10000003', '3033', '{\"hp\":342}', '{\"defend\":19,\"hp\":188,\"speed\":12}', '2', '0', '0');
INSERT INTO `user_equipment` VALUES ('356', '10000003', '3023', '{\"defend\":34}', '{\"hit\":12,\"critHurt\":25,\"hp\":187}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('358', '10000003', '3003', '{\"hit\":16}', '{\"defend\":26,\"resist\":13,\"speed\":14}', '2', '2', '0');
INSERT INTO `user_equipment` VALUES ('360', '10000003', '3053', '{\"resist\":27}', '{\"defend\":17,\"attack\":48,\"speed\":15}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('361', '10000003', '3043', '{\"speed\":20}', '{\"hit\":13,\"critHurt\":20,\"resist\":13}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('363', '10000003', '3013', '{\"attack\":54}', '{\"critHurt\":25,\"hp\":189,\"critRate\":9}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('364', '10000003', '3023', '{\"defend\":29}', '{\"critHurt\":20,\"resist\":9,\"speed\":15}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('365', '10000003', '3003', '{\"resist\":26}', '{\"hit\":14,\"attack\":53,\"critRate\":11}', '1', '0', '0');
INSERT INTO `user_equipment` VALUES ('366', '10000003', '3033', '{\"defend\":33}', '{\"attack\":47,\"resist\":9,\"hp\":264}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('367', '10000003', '3013', '{\"critHurt\":24}', '{\"defend\":27,\"critHurt\":16,\"resist\":13}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('368', '10000003', '3042', '{\"critHurt\":13}', '{\"defend\":17,\"resist\":10}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('369', '10000003', '3023', '{\"resist\":26}', '{\"defend\":26,\"hp\":202,\"speed\":13}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('370', '10000008', '3033', '{\"resist\":16}', '{\"hit\":13,\"defend\":17,\"critRate\":8}', '0', '0', '1373');
INSERT INTO `user_equipment` VALUES ('371', '10000008', '3013', '{\"attack\":52}', '{\"hit\":11,\"resist\":13,\"critRate\":12}', '0', '0', '1373');
INSERT INTO `user_equipment` VALUES ('372', '10000008', '3023', '{\"resist\":29}', '{\"resist\":12,\"critRate\":7,\"speed\":13}', '0', '0', '1373');
INSERT INTO `user_equipment` VALUES ('373', '10000008', '3003', '{\"defend\":23}', '{\"hit\":15,\"hp\":198,\"speed\":8}', '0', '0', '1373');
INSERT INTO `user_equipment` VALUES ('374', '10000008', '3053', '{\"hp\":322}', '{\"hit\":13,\"defend\":26,\"speed\":7}', '0', '0', '1373');
INSERT INTO `user_equipment` VALUES ('375', '10000008', '3053', '{\"defend\":30}', '{\"hit\":14,\"resist\":12,\"hp\":217}', '0', '0', '0');
INSERT INTO `user_equipment` VALUES ('376', '10000008', '3043', '{\"attack\":63}', '{\"hit\":8,\"resist\":10,\"critRate\":11}', '0', '0', '1373');
INSERT INTO `user_equipment` VALUES ('377', '10000008', '3043', '{\"critRate\":17}', '{\"defend\":21,\"hp\":271,\"critRate\":13}', '0', '0', '0');

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `id` int NOT NULL,
  `nickname` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `gender` int NOT NULL DEFAULT '0',
  `avatarUrl` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `coin` int NOT NULL DEFAULT '0',
  `diamond` int NOT NULL DEFAULT '0',
  `strength` int NOT NULL DEFAULT '120',
  `integral` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES ('10000003', '玩家10000003', '2', 'Texture/Icon/HeadPhoto/6901', '999754000', '531252', '100', '985');
INSERT INTO `user_info` VALUES ('10000008', '玩家10000008', '1', 'Texture/Icon/HeadPhoto/6902', '90000', '42356', '100', '1015');

-- ----------------------------
-- Table structure for user_login
-- ----------------------------
DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(24) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000015 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_login
-- ----------------------------
INSERT INTO `user_login` VALUES ('10000003', '123456', '123456');
INSERT INTO `user_login` VALUES ('10000008', 'asdfgh', 'asdfgh');
INSERT INTO `user_login` VALUES ('10000013', 'asdasd', 'asdasd');
INSERT INTO `user_login` VALUES ('10000014', '123123', '123123');

-- ----------------------------
-- Table structure for user_pet
-- ----------------------------
DROP TABLE IF EXISTS `user_pet`;
CREATE TABLE `user_pet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `pet_level` int NOT NULL DEFAULT '0',
  `blood_level` int NOT NULL DEFAULT '0',
  `break_level` int NOT NULL DEFAULT '0',
  `pet_exp` int NOT NULL DEFAULT '0',
  `blood_exp` int NOT NULL DEFAULT '0',
  `fragment` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_pet_ibfk_1` (`user_id`),
  CONSTRAINT `user_pet_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1387 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_pet
-- ----------------------------
INSERT INTO `user_pet` VALUES ('1370', '10000003', '6006', '0', '0', '0', '0', '0', '1');
INSERT INTO `user_pet` VALUES ('1371', '10000008', '6095', '0', '0', '0', '0', '0', '4');
INSERT INTO `user_pet` VALUES ('1372', '10000008', '6017', '0', '0', '0', '0', '0', '1');
INSERT INTO `user_pet` VALUES ('1373', '10000008', '6140', '100', '0', '0', '600000', '0', '1');
INSERT INTO `user_pet` VALUES ('1374', '10000008', '6005', '0', '0', '0', '0', '0', '14');
INSERT INTO `user_pet` VALUES ('1375', '10000008', '6104', '0', '0', '0', '0', '0', '3');
INSERT INTO `user_pet` VALUES ('1376', '10000008', '6004', '0', '0', '0', '0', '0', '9');
INSERT INTO `user_pet` VALUES ('1377', '10000008', '6115', '0', '0', '0', '0', '0', '4');
INSERT INTO `user_pet` VALUES ('1378', '10000008', '6133', '0', '0', '0', '0', '0', '1');
INSERT INTO `user_pet` VALUES ('1379', '10000008', '6113', '0', '0', '0', '0', '0', '1');
INSERT INTO `user_pet` VALUES ('1380', '10000008', '6131', '0', '0', '0', '0', '0', '2');
INSERT INTO `user_pet` VALUES ('1381', '10000003', '6115', '0', '0', '0', '0', '0', '2');
INSERT INTO `user_pet` VALUES ('1382', '10000003', '6004', '0', '0', '0', '0', '0', '2');
INSERT INTO `user_pet` VALUES ('1383', '10000003', '6017', '0', '0', '0', '0', '0', '1');
INSERT INTO `user_pet` VALUES ('1384', '10000003', '6113', '0', '0', '0', '0', '0', '1');
INSERT INTO `user_pet` VALUES ('1385', '10000003', '6005', '0', '0', '0', '0', '0', '0');
INSERT INTO `user_pet` VALUES ('1386', '10000003', '6104', '0', '0', '0', '0', '0', '0');

-- ----------------------------
-- Table structure for user_prop
-- ----------------------------
DROP TABLE IF EXISTS `user_prop`;
CREATE TABLE `user_prop` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `prop_id` int NOT NULL,
  `amount` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_prop_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=398 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_prop
-- ----------------------------
INSERT INTO `user_prop` VALUES ('385', '10000003', '1002', '8');
INSERT INTO `user_prop` VALUES ('386', '10000003', '1003', '11');
INSERT INTO `user_prop` VALUES ('388', '10000003', '2032', '4');
INSERT INTO `user_prop` VALUES ('391', '10000003', '2022', '8');
INSERT INTO `user_prop` VALUES ('393', '10000003', '1001', '5');
INSERT INTO `user_prop` VALUES ('394', '10000003', '1004', '10');
INSERT INTO `user_prop` VALUES ('395', '10000003', '2002', '3');
INSERT INTO `user_prop` VALUES ('397', '10000008', '1004', '4');

-- ----------------------------
-- Table structure for user_vs_rank
-- ----------------------------
DROP TABLE IF EXISTS `user_vs_rank`;
CREATE TABLE `user_vs_rank` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `avatarUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `pet_ids` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `pet_levels` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `strength` int NOT NULL,
  `integral` int NOT NULL,
  `create_time` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `integral` (`integral`) USING BTREE,
  CONSTRAINT `user_vs_rank_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_vs_rank
-- ----------------------------
INSERT INTO `user_vs_rank` VALUES ('254', '10000003', '玩家10000003', 'Texture/Icon/HeadPhoto/6901', '[6006,6115,6005,6104,6017,6004]', '[0,0,0,0,0,0]', '40003', '985', '2020-06-04 01:43:53');
INSERT INTO `user_vs_rank` VALUES ('255', '10000008', '玩家10000008', 'Texture/Icon/HeadPhoto/6902', '[6140,6115,6095,6017,6104,6133]', '[100,0,0,0,0,0]', '123765', '1015', '2020-06-04 01:43:53');
