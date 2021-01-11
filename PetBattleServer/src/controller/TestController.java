package controller;

import pers.jc.network.SocketComponent;
import pers.jc.network.SocketMethod;

@SocketComponent("TestController")
public class TestController {
	
	@SocketMethod
	public void test(int a) {
		System.out.println(a);
	}
}
