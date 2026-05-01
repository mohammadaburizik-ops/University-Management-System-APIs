package com.un.un.Config;


import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.config.annotation.WsConfigurerAdapter;
import org.springframework.ws.server.endpoint.adapter.DefaultMethodEndpointAdapter;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.ws.wsdl.wsdl11.Wsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;


@EnableWs
@Configuration
public class WebServiceConfig extends WsConfigurerAdapter {
@Bean
public DefaultMethodEndpointAdapter defaultMethodEndpointAdapter() {
return new DefaultMethodEndpointAdapter();
}

@Bean
public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(ApplicationContext applicationContext) {
    MessageDispatcherServlet servlet = new MessageDispatcherServlet();
    servlet.setApplicationContext(applicationContext);
    servlet.setTransformWsdlLocations(true);
    return new ServletRegistrationBean<>(servlet, "/ws/*");
}


@Bean(name = "un")
public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema unSchema) {
    DefaultWsdl11Definition wsdl11Definition = new DefaultWsdl11Definition();
    wsdl11Definition.setPortTypeName("UnPort");
    wsdl11Definition.setLocationUri("/ws");
    wsdl11Definition.setTargetNamespace("http://www.baeldung.com/springsoap/gen");
    wsdl11Definition.setSchema(unSchema);
    return wsdl11Definition;
}

@Bean
public XsdSchema unSchema() {
    return new SimpleXsdSchema(new ClassPathResource("un.xsd"));
}




@Bean(name = "hello")
public Wsdl11Definition helloWsdl11Definition() {
DefaultWsdl11Definition wsdl11Definition = new DefaultWsdl11Definition();
wsdl11Definition.setPortTypeName("HelloPortType");
wsdl11Definition.setLocationUri("/soap-api");
wsdl11Definition.setTargetNamespace("http://example.com/soap-web-service");
wsdl11Definition.setSchema(helloSchema());
return wsdl11Definition;
}
@Bean
public SimpleXsdSchema helloSchema() {
return new SimpleXsdSchema(new ClassPathResource("un.xsd"));
}




}
