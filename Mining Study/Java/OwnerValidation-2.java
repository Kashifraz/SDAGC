package org.springframework.samples.petclinic.domain;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.SpanKind;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.instrumentation.annotations.WithSpan;
import org.springframework.samples.petclinic.owner.Owner;

import java.util.concurrent.ThreadLocalRandom;

public class OwnerValidation {

	private int counter = 0;

	private UserValidationService usrValSvc;

	private PasswordUtils pwdUtils;

	private Tracer otelTracer;

	private RoleService roleSvc;

	private TwoFactorAuthenticationService twoFASvc;

	public OwnerValidation(Tracer otelTracer) {
		this.pwdUtils = new PasswordUtils();
		this.roleSvc = new RoleService();
		this.otelTracer = otelTracer;
		this.usrValSvc = new UserValidationService();
		this.twoFASvc = new TwoFactorAuthenticationService();
	}

	@WithSpan
	public void ValidateOwnerWithExternalService(Owner owner) {

		this.AuthServiceValidateUser(owner);
	}

	@WithSpan
	private void NewFunction() {

	}

	@WithSpan
	public boolean UserNameMustStartWithR(String usr) {

		if (!usr.toLowerCase().startsWith("r")) {
			return false;
		}

		return true;

	}


	// This function and classes were generated by ChatGPT
	@WithSpan
	public boolean ValidateUserAccess(String usr, String pswd, String sysCode) {

		UserNameMustStartWithR(usr);
		boolean vldUsr = usrValSvc.vldtUsr(usr);
		if (!vldUsr) {
			return false;
		}

		boolean vldPswd = pwdUtils.vldtPswd(usr, pswd);
		if (!vldPswd) {
			return false;
		}

		boolean vldUsrRole = roleSvc.vldtUsrRole(usr, sysCode);
		if (!vldUsrRole) {
			return false;
		}

		boolean is2FASuccess = twoFASvc.init2FA(usr);
		if (!is2FASuccess) {
			return false;
		}

		boolean is2FATokenValid = false;
		int retry = 0;
		while (retry < 3 && !is2FATokenValid) {
			String token = twoFASvc.getTokenInput();
			is2FATokenValid = twoFASvc.vldtToken(usr, token);
			retry++;
		}

		if (!is2FATokenValid) {
			return false;
		}

		return true;
	}

	@WithSpan
	private synchronized void AuthServiceValidateUser(Owner owner) {
		// This is the actual Root Cause!!
		try {
			Thread.sleep(4200 + ThreadLocalRandom.current().nextInt(90, 1100 + 1));
		}
		catch (InterruptedException e) {
			throw new RuntimeException(e);
		}
	}

	@WithSpan
	public boolean checkOwnerValidity(Owner owner) {

		this.ValidateOwnerUserBad(owner);
		return ValidateOwnerUser(owner);

	}

	@WithSpan
	private boolean ValidateOwnerUserBad(Owner owner) {
		{

			for (int i = 0; i < 100; i++) {
				ValidateOwner();
			}
			return true;

		}
	}

	@WithSpan
	private boolean ValidateOwnerUser(Owner owner) {

		Span span = otelTracer.spanBuilder("db_access_01").startSpan();

		var max = ThreadLocalRandom.current().nextInt(90, 110 + 1);
		try {
			for (int i = 0; i < max; i++) {
				ValidateOwner();
			}
		}
		finally {
			span.end();
		}
		return true;

	}

	@WithSpan
	private void ValidateOwner() {
		// simulate SpanKind of DB query
		// see
		// https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/database.md
		Span span = otelTracer.spanBuilder("query_users_by_id")
			.setSpanKind(SpanKind.CLIENT)
			.setAttribute("db.system", "other_sql")
			.setAttribute("db.statement", "select * from users where id = :id")
			.startSpan();

		try {
			Thread.sleep(14);
		}
		catch (Exception e) {

		}
		finally {
			span.end();
		}
	}

	public boolean PerformValidationFlow(String usr, String pswd, String sysCode) {
		UserNameMustStartWithR(usr);
		boolean vldUsr = usrValSvc.vldtUsr(usr);
		if (!vldUsr) {
			return false;
		}

		boolean vldPswd = pwdUtils.vldtPswd(usr, pswd);
		if (!vldPswd) {
			return false;
		}

		boolean vldUsrRole = roleSvc.vldtUsrRole(usr, sysCode);
		if (!vldUsrRole) {
			return false;
		}

		boolean is2FASuccess = twoFASvc.init2FA(usr);
		if (!is2FASuccess) {
			return false;
		}

		boolean is2FATokenValid = false;
		int retry = 0;
		while (retry < 3 && !is2FATokenValid) {
			String token = twoFASvc.getTokenInput();
			is2FATokenValid = twoFASvc.vldtToken(usr, token);
			retry++;
		}

		if (!is2FATokenValid) {
			return false;
		}

		return true;

	}

}
