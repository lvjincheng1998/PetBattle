/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 80020
Source Host           : localhost:3306
Source Database       : pet_battle

Target Server Type    : MYSQL
Target Server Version : 80020
File Encoding         : 65001

Date: 2020-05-29 21:08:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for friend_chat
-- ----------------------------
DROP TABLE IF EXISTS `friend_chat`;
CREATE TABLE `friend_chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `my_user_id` int NOT NULL,
  `friend_user_id` int NOT NULL,
  `message` varchar(255) NOT NULL,
  `send_time` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `read` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `my_user_id` (`my_user_id`),
  KEY `friend_user_id` (`friend_user_id`),
  CONSTRAINT `friend_chat_ibfk_1` FOREIGN KEY (`my_user_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friend_chat_ibfk_2` FOREIGN KEY (`friend_user_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  `my_user_id` int NOT NULL,
  `friend_user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `my_user_id` (`my_user_id`),
  KEY `friend_user_id` (`friend_user_id`),
  CONSTRAINT `friend_mapper_ibfk_1` FOREIGN KEY (`my_user_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friend_mapper_ibfk_2` FOREIGN KEY (`friend_user_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of friend_mapper
-- ----------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=448 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_embattle
-- ----------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=351 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_equipment
-- ----------------------------

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `id` int NOT NULL,
  `nickname` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `gender` int NOT NULL DEFAULT '0',
  `avatarUrl` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `coin` int NOT NULL DEFAULT '0',
  `diamond` int NOT NULL DEFAULT '0',
  `strength` int NOT NULL DEFAULT '120',
  PRIMARY KEY (`id`),
  CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES ('10000003', '玩家10000003', '2', 'http://118.89.184.186:888/avatar/cartoon/girl/1.jpg', '100000', '100000', '100');
INSERT INTO `user_info` VALUES ('10000008', '玩家10000008', '1', 'http://118.89.184.186:888/avatar/cartoon/boy/1.jpg', '100000', '100000', '100');

-- ----------------------------
-- Table structure for user_login
-- ----------------------------
DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(24) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000013 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_login
-- ----------------------------
INSERT INTO `user_login` VALUES ('10000003', '123456', '123456');
INSERT INTO `user_login` VALUES ('10000008', 'asdfgh', 'asdfgh');

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
  PRIMARY KEY (`id`),
  KEY `user_pet_ibfk_1` (`user_id`),
  CONSTRAINT `user_pet_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_login` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1331 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_pet
-- ----------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=381 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_prop
-- ----------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_vs_rank
-- ----------------------------
