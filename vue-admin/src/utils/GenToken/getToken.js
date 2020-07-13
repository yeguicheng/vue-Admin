import CryptoJS from "@/utils/GenToken/crypto-js.js"
import {
	base64encode,
	utf16to8,
	safe64
} from "@/utils/GenToken/tokenTools.js"
export function GetUploadToken() {
	/**
	 * 上传凭证算法实现参考
	 * 请注意External Resources项中引用的第三方CryptoJS库
	 */
	var accessKey = "7a2y9mj0quQGOPuLIxa2uiUprQxKzYCxhfMJFuzA";
	var secretKey = "DQGAbsoUyYn5JmnlWNySUHQgeWd-h851PbnfEAI5";
	var scopeName = "yeguicheng";//空间名
	var deadline = 3554294430; //token有效截止日期

	//deadline unix的时间戳   让token到2020年失效
	var putPolicy = {
		"scope": scopeName,
		"deadline": deadline
	};
	//SETP 2
	var put_policy = JSON.stringify(putPolicy);
	// console && console.log("put_policy = ", put_policy);
	//SETP 3
	var encoded = base64encode(utf16to8(put_policy));
	// console && console.log("encoded = ", encoded);
	//SETP 4
	var hash = CryptoJS.HmacSHA1(encoded, secretKey);
	var encoded_signed = hash.toString(CryptoJS.enc.Base64);
	// console && console.log("encoded_signed=", encoded_signed);
	//SETP 5
	var upload_token = accessKey + ":" + safe64(encoded_signed) + ":" + encoded;
	// console && console.log("upload_token=", upload_token);
	return upload_token;
}
