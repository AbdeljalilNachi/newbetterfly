package com.betterfly.repository;

import com.betterfly.domain.IndicateurSMI;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the IndicateurSMI entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IndicateurSMIRepository extends JpaRepository<IndicateurSMI, Long> {}
